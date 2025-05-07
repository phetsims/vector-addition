// Copyright 2019-2025, University of Colorado Boulder

/**
 * Graph is the graph for a scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Disposable from '../../../../axon/js/Disposable.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import { GraphOrientation } from './GraphOrientation.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';

const MODEL_TO_VIEW_SCALE = 14.5;

type SelfOptions = {
  initialBounds: Bounds2;
  orientation?: GraphOrientation;
  bottomLeft?: Vector2; // bottom left corner of the graph, in view coordinates
};

export type GraphOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Graph {

  // orientation of the graph
  public readonly orientation: GraphOrientation;

  // Bounds of the graph in model coordinates.
  private readonly boundsProperty: Property<Bounds2>;

  // Bounds of the graph in view coordinates.
  public readonly viewBounds: Bounds2;

  // Maps graph coordinates between model and view coordinate frames.
  public readonly modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>;

  // Since the origin is being dragged, modelViewTransform is in the model. That being said, it is necessary to know the
  // view coordinates of the scene node's bottom-left to calculate the model view transform.
  // Calculate the default for the grid's bottom-left, in view coordinates.
  public static readonly DEFAULT_BOTTOM_LEFT = new Vector2(
    VectorAdditionConstants.SCREEN_VIEW_BOUNDS.minX + VectorAdditionConstants.AXES_ARROW_X_EXTENSION + 10,
    VectorAdditionConstants.SCREEN_VIEW_BOUNDS.maxY - VectorAdditionConstants.AXES_ARROW_Y_EXTENSION - 45
  );

  public constructor( providedOptions: GraphOptions ) {

    const options = optionize<GraphOptions, SelfOptions>()( {

      // SelfOptions
      orientation: 'twoDimensional',
      bottomLeft: Graph.DEFAULT_BOTTOM_LEFT
    }, providedOptions );

    this.orientation = options.orientation;

    this.boundsProperty = new Property( options.initialBounds, {
      phetioValueType: Bounds2.Bounds2IO,
      tandem: options.tandem.createTandem( 'boundsProperty' ),
      phetioDocumentation: 'Bounds of the scene, in model coordinates.',
      phetioReadOnly: true
    } );

    this.viewBounds = new Bounds2( options.bottomLeft.x,
      options.bottomLeft.y - MODEL_TO_VIEW_SCALE * options.initialBounds.height,
      options.bottomLeft.x + MODEL_TO_VIEW_SCALE * options.initialBounds.width,
      options.bottomLeft.y );

    this.modelViewTransformProperty = new DerivedProperty( [ this.boundsProperty ],
      bounds => ModelViewTransform2.createRectangleInvertedYMapping( bounds, this.viewBounds ),
      { valueType: ModelViewTransform2 }
    );
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }

  public reset(): void {
    this.boundsProperty.reset();
  }

  /**
   * Moves the origin to a specified point on the graph.
   */
  public moveOriginToPoint( point: Vector2 ): void {
    assert && assert( this.boundsProperty.value.containsPoint( point ), `point is out of bounds: ${point}` );

    // Round to integer
    const roundedPoint = point.roundSymmetric();
    this.boundsProperty.value = this.bounds.shiftedXY( -roundedPoint.x, -roundedPoint.y );
  }

  /**
   * Gets the bounds of the graph, in model coordinates.
   */
  public get bounds(): Bounds2 {
    return this.boundsProperty.value;
  }
}

vectorAddition.register( 'Graph', Graph );