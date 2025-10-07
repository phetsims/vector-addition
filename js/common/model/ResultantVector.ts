// Copyright 2025, University of Colorado Boulder

/**
 * ResultantVector is the base class for the resultant vector of a vector set. In the Explore 1D, Explore 2D, and
 * Lab screens, the resultant vector is a sum vector.  In the Equations screen, the resultant vector depends on the
 * equation type that is selected. This class was introduced for https://github.com/phetsims/vector-addition/issues/334.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector, { VectorOptions } from './Vector.js';
import vectorAddition from '../../vectorAddition.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import VectorAdditionScene from './VectorAdditionScene.js';
import VectorSet from './VectorSet.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = EmptySelfOptions;

type ResultantVectorOptions = SelfOptions & WithRequired<VectorOptions, 'tandem'>;

export default class ResultantVector extends Vector {

  // Whether the resultant vector is defined.
  public readonly isDefinedProperty: Property<boolean>;

  protected constructor( initialTailPosition: Vector2,
                         initialComponents: Vector2,
                         scene: VectorAdditionScene,
                         vectorSet: VectorSet,
                         symbolProperty: TReadOnlyProperty<string>,
                         providedOptions: ResultantVectorOptions ) {

    const options = optionize<ResultantVectorOptions, SelfOptions, VectorOptions>()( {

      // VectorOptions
      isDisposable: false, // Resultant vectors are not disposable.
      isRemovableFromGraph: false, // Resultant vectors are not removable from the graph.
      isTipDraggable: false, // Resultant vectors are not draggable by the tip.
      isOnGraphInitially: true, // Resultant vectors are always on the graph.
      isOnGraphPropertyInstrumented: false // Resultant vectors are always on the graph.
    }, providedOptions );

    super( initialTailPosition, initialComponents, scene, vectorSet, symbolProperty, options );

    //TODO https://github.com/phetsims/vector-addition/issues/334 ResultantVector should be responsible for updating isDefinedProperty.
    this.isDefinedProperty = new BooleanProperty( vectorSet.vectors.filter( vector => vector.isOnGraphProperty.value ).length > 0, {
      tandem: options.tandem.createTandem( 'isDefinedProperty' ),
      phetioReadOnly: true
    } );
  }

  public override reset(): void {
    super.reset();
    this.isDefinedProperty.reset();
  }
}

vectorAddition.register( 'ResultantVector', ResultantVector );