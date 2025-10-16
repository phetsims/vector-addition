// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsVector is a specialization of Vector for the 'Equations' screen.  It adds mutable coefficient and base vector.
 * Instances exist for the lifetime of the sim and do not need to be disposed.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import BaseVector from '../../common/model/BaseVector.js';
import CartesianBaseVector from '../../common/model/CartesianBaseVector.js';
import PolarBaseVector from '../../common/model/PolarBaseVector.js';
import { LabelDisplayData } from '../../common/model/RootVector.js';
import Vector, { VectorOptions } from '../../common/model/Vector.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsVectorSet from './EquationsVectorSet.js';
import Graph from '../../common/model/Graph.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

// initial coefficient and range
const COEFFICIENT_RANGE = new RangeWithValue( -5, 5, 1 );

type SelfOptions = EmptySelfOptions;

type EquationsVectorOptions = SelfOptions &
  StrictOmit<VectorOptions, 'isRemovableFromGraph' | 'isTipDraggable' | 'isOnGraph' | 'isOnGraphPropertyInstrumented'>;

export default class EquationsVector extends Vector {

  public readonly coefficientProperty: NumberProperty;
  public readonly baseVector: BaseVector;

  public constructor( tailPosition: Vector2,
                      xyComponents: Vector2,
                      baseVectorTailPosition: Vector2,
                      vectorSet: EquationsVectorSet,
                      graph: Graph,
                      selectedVectorProperty: Property<Vector | null>,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      providedOptions: EquationsVectorOptions ) {

    const options = optionize<EquationsVectorOptions, SelfOptions, VectorOptions>()( {
      isRemovableFromGraph: false, // Equations vectors are not removable from the graph
      isTipDraggable: false, // Equations vectors are not draggable by the tip
      isOnGraph: true, // Equations vectors are always on the graph
      isOnGraphPropertyInstrumented: false // Equations vectors are always on the graph
    }, providedOptions );

    super( tailPosition, xyComponents, vectorSet, graph, selectedVectorProperty, componentVectorStyleProperty, options );

    this.coefficientProperty = new NumberProperty( COEFFICIENT_RANGE.defaultValue, {
      range: COEFFICIENT_RANGE,
      tandem: options.tandem.createTandem( 'coefficientProperty' )
    } );

    // Set the tip to itself to ensure Invariants for Polar/Cartesian is satisfied.
    this.setTipWithInvariants( this.tip );

    // Instantiate a base vector.
    const baseVectorXYComponents = this.xyComponents.dividedScalar( this.coefficientProperty.value );
    const baseVectorOptions = {
      symbolProperty: options.symbolProperty,
      coordinateSnapMode: options.coordinateSnapMode,
      vectorColorPalette: vectorSet.vectorColorPalette,
      tandemNameSymbol: options.tandemNameSymbol,
      tandem: options.tandem.createTandem( `${this.tandemNameSymbol}BaseVector` )
    };
    if ( options.coordinateSnapMode === 'cartesian' ) {
      this.baseVector = new CartesianBaseVector( baseVectorTailPosition, baseVectorXYComponents,
        vectorSet, graph, selectedVectorProperty, componentVectorStyleProperty, baseVectorOptions );
    }
    else {
      this.baseVector = new PolarBaseVector( baseVectorTailPosition, baseVectorXYComponents,
        vectorSet, graph, selectedVectorProperty, componentVectorStyleProperty, baseVectorOptions );
    }

    // Observe when the base vector changes, or when the coefficient Property changes and update the vector.
    Multilink.multilink( [ this.baseVector.xyComponentsProperty, this.coefficientProperty ],
      ( xyComponents, coefficient ) => {
        this.xyComponentsProperty.value = xyComponents.timesScalar( coefficient );
      } );
  }

  public override reset(): void {
    this.coefficientProperty.reset();
    this.baseVector.reset();
    super.reset();
  }

  /**
   * Vectors in the Equations screen have an associated coefficient.
   * See RootVector.getLabelDisplayData for details.
   */
  public override getLabelDisplayData( valuesVisible: boolean ): LabelDisplayData {
    return combineOptions<LabelDisplayData>( super.getLabelDisplayData( valuesVisible ), {
      coefficient: this.coefficientProperty.value
    } );
  }
}

vectorAddition.register( 'EquationsVector', EquationsVector );