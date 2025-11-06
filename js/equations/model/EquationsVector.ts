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
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BaseVector from '../../common/model/BaseVector.js';
import CartesianBaseVector from '../../common/model/CartesianBaseVector.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import Graph from '../../common/model/Graph.js';
import PolarBaseVector from '../../common/model/PolarBaseVector.js';
import { LabelDisplayData } from '../../common/model/RootVector.js';
import Vector, { VectorOptions } from '../../common/model/Vector.js';
import VectorSet from '../../common/model/VectorSet.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';

// initial coefficient and range
const COEFFICIENT_RANGE = new Range( -5, 5 );

type SelfOptions = {
  baseVectorTandem: Tandem;
};

type EquationsVectorOptions = SelfOptions &
  StrictOmit<VectorOptions, 'isRemovableFromGraph' | 'isTipDraggable' | 'isOnGraph' | 'isOnGraphPropertyInstrumented' | 'accessibleSymbolProperty'> &
  PickRequired<VectorOptions, 'symbolProperty'>;

export default class EquationsVector extends Vector {

  public readonly coefficientProperty: NumberProperty;
  public readonly baseVector: BaseVector;

  public constructor( tailPosition: Vector2,
                      baseVectorTailPosition: Vector2,
                      baseVectorXYComponents: Vector2,
                      vectorSet: VectorSet,
                      graph: Graph,
                      selectedVectorProperty: Property<Vector | null>,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      providedOptions: EquationsVectorOptions ) {

    const coefficientProperty = new NumberProperty( 1, {
      range: COEFFICIENT_RANGE,
      tandem: providedOptions.tandem.createTandem( 'coefficientProperty' ),
      phetioFeatured: true
    } );

    const accessibleSymbolProperty = new PatternStringProperty( VectorAdditionStrings.a11y.equationsVectorNode.accessibleNameStringProperty, {
      coefficient: coefficientProperty,
      symbol: RichText.getAccessibleStringProperty( providedOptions.symbolProperty )
    } );

    const options = optionize<EquationsVectorOptions, SelfOptions, VectorOptions>()( {

      // VectorOptions
      accessibleSymbolProperty: accessibleSymbolProperty,
      isRemovableFromGraph: false, // Equations vectors are not removable from the graph
      isTipDraggable: false, // Equations vectors are not draggable by the tip
      isOnGraph: true, // Equations vectors are always on the graph
      isOnGraphPropertyInstrumented: false // Equations vectors are always on the graph
    }, providedOptions );

    super( tailPosition, baseVectorXYComponents.timesScalar( coefficientProperty.value ), vectorSet, graph, selectedVectorProperty, componentVectorStyleProperty, options );

    this.coefficientProperty = coefficientProperty;

    // Set the tip to itself to ensure Invariants for Polar/Cartesian is satisfied.
    this.setTipPositionWithInvariants( this.tip );

    // Instantiate a base vector.
    const baseVectorOptions = {
      symbolProperty: options.symbolProperty,
      coordinateSnapMode: options.coordinateSnapMode,
      vectorColorPalette: vectorSet.vectorColorPalette,
      tandemNameSymbol: options.tandemNameSymbol,
      tandem: options.baseVectorTandem
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
        if ( !isSettingPhetioStateProperty.value ) {
          this.xyComponentsProperty.value = xyComponents.timesScalar( coefficient );
        }
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